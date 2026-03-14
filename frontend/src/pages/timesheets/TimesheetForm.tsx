import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { FormInput, FormSelect } from '../../components/forms';
import { useCreateTimesheet } from '../../store/timesheetStore';
import { useUser } from '../../store/authStore';
import { timesheetApi } from '../../services/timesheetApi';

// Form schema
const timesheetSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  tasks: z.array(z.object({
    date: z.string().min(1, 'Date is required'),
    projectId: z.string().min(1, 'Project is required'),
    taskId: z.string().min(1, 'Task is required'),
    taskName: z.string(),
    hours: z.string().min(1, 'Hours are required'),
    description: z.string().min(1, 'Description is required'),
  })).min(1, 'At least one task is required'),
  comments: z.string().optional(),
});

type TimesheetFormData = z.infer<typeof timesheetSchema>;

interface Project {
  id: number;
  name: string;
  tasks: { id: number; name: string }[];
}

const TimesheetForm: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const createTimesheet = useCreateTimesheet();
  const [projects, setProjects] = useState<Project[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    control,
  } = useForm<TimesheetFormData>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      tasks: [{ date: '', projectId: '', taskId: '', taskName: '', hours: '0', description: '' }],
      comments: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasks',
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      const data = await timesheetApi.getProjects();
      setProjects(data);
    };
    loadProjects();
  }, []);

  // Update task name when project/task changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.includes('tasks') && name?.includes('projectId')) {
        const index = parseInt(name.split('.')[1]);
        const projectId = value.tasks?.[index]?.projectId;
        if (projectId) {
          const project = projects.find(p => p.id === parseInt(projectId));
          if (project && project.tasks.length > 0) {
            setValue(`tasks.${index}.taskId`, project.tasks[0].id.toString());
            setValue(`tasks.${index}.taskName`, project.tasks[0].name);
          }
        }
      }
      if (name?.includes('tasks') && name?.includes('taskId')) {
        const index = parseInt(name.split('.')[1]);
        const projectId = value.tasks?.[index]?.projectId;
        const taskId = value.tasks?.[index]?.taskId;
        if (projectId && taskId) {
          const project = projects.find(p => p.id === parseInt(projectId));
          const task = project?.tasks.find(t => t.id === parseInt(taskId));
          if (task) {
            setValue(`tasks.${index}.taskName`, task.name);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, projects, setValue]);

  const onSubmit = async (data: TimesheetFormData) => {
    try {
      const timesheetData = {
        startDate: data.startDate,
        endDate: data.endDate,
        tasks: data.tasks.map(task => ({
          date: task.date,
          projectId: task.projectId,
          taskId: task.taskId,
          taskName: task.taskName,
          hours: parseFloat(task.hours),
          description: task.description,
        })),
        comments: data.comments,
      };

      await createTimesheet(
        timesheetData,
        user?.id || 1,
        `${user?.firstName} ${user?.lastName}` || 'Employee'
      );
      
      navigate('/timesheets');
    } catch (error) {
      console.error('Error creating timesheet:', error);
    }
  };

  const addTask = () => {
    append({ date: '', projectId: '', taskId: '', taskName: '', hours: '0', description: '' });
  };

  const removeTask = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Generate date options between start and end date
  const getDateOptions = () => {
    if (!startDate || !endDate) return [];
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    while (start <= end) {
      dates.push(start.toISOString().split('T')[0]);
      start.setDate(start.getDate() + 1);
    }
    return dates;
  };

  const dateOptions = getDateOptions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Timesheets', href: '/timesheets' },
            { label: 'Add Timesheet' },
          ]}
        />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          Submit Timesheet
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Fill in your daily tasks and hours for the selected date range.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Date Range */}
          <Card>
            <CardTitle as="h2">Date Range</CardTitle>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Start Date"
                  name="startDate"
                  register={register}
                  error={errors.startDate}
                  type="date"
                  required
                />
                <FormInput
                  label="End Date"
                  name="endDate"
                  register={register}
                  error={errors.endDate}
                  type="date"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardTitle as="h2">Daily Tasks</CardTitle>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">Task {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTask(index)}
                        disabled={fields.length === 1}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormSelect
                        label="Date"
                        name={`tasks.${index}.date`}
                        register={register}
                        error={errors.tasks?.[index]?.date}
                        options={dateOptions.map(date => ({ value: date, label: new Date(date).toLocaleDateString() }))}
                        required
                      />
                      <FormSelect
                        label="Project"
                        name={`tasks.${index}.projectId`}
                        register={register}
                        error={errors.tasks?.[index]?.projectId}
                        options={projects.map(p => ({ value: p.id.toString(), label: p.name }))}
                        required
                      />
                      <FormSelect
                        label="Task"
                        name={`tasks.${index}.taskId`}
                        register={register}
                        error={errors.tasks?.[index]?.taskId}
                        options={
                          projects.find(p => p.id.toString() === watch(`tasks.${index}.projectId`))?.tasks.map(t => ({
                            value: t.id.toString(),
                            label: t.name,
                          })) || []
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="Hours"
                        name={`tasks.${index}.hours`}
                        register={register}
                        error={errors.tasks?.[index]?.hours}
                        type="number"
                        placeholder="0"
                        required
                        leftIcon={<span className="text-gray-500">hrs</span>}
                      />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          {...register(`tasks.${index}.description`)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Describe what you worked on..."
                        />
                        {errors.tasks?.[index]?.description && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.tasks[index].description?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={addTask}
                className="mt-4"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Add Task
              </Button>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardTitle as="h2">Additional Comments (Optional)</CardTitle>
            <CardContent>
              <textarea
                {...register('comments')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Any additional notes or comments..."
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/timesheets')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Timesheet'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TimesheetForm;
